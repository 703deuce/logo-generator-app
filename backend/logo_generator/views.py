import requests
import time
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import os
import logging

API_KEY = os.getenv('BFL_API_KEY')
AIVIDEOAPI_KEY = os.getenv('AIVIDEOAPI_KEY')

logger = logging.getLogger(__name__)

def generate_logo(prompt, width, height):
    url = 'https://api.bfl.ml/v1/flux-pro-1.1'
    headers = {
        'accept': 'application/json',
        'x-key': API_KEY,
        'Content-Type': 'application/json',
    }
    data = {
        'prompt': prompt,
        'width': width,
        'height': height,
    }
    
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    return response.json()

def get_logo_result(request_id):
    url = 'https://api.bfl.ml/v1/get_result'
    headers = {
        'accept': 'application/json',
        'x-key': API_KEY,
    }
    params = {
        'id': request_id,
    }
    
    max_attempts = 60  # Maximum number of attempts (30 seconds)
    for _ in range(max_attempts):
        time.sleep(0.5)
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        result = response.json()
        
        if result["status"] == "Ready":
            return result['result']['sample']
    
    raise Exception("Logo generation timed out")

@csrf_exempt
def generate_logos(request):
    if request.method == 'POST':
        prompt = request.POST.get('prompt')
        width = int(request.POST.get('width', 1024))
        height = int(request.POST.get('height', 768))
        
        logos = []
        try:
            for _ in range(5):  # Changed from 16 to 5
                try:
                    request_data = generate_logo(prompt, width, height)
                    request_id = request_data["id"]
                    logo_url = get_logo_result(request_id)
                    logos.append(logo_url)
                except Exception as e:
                    logger.error(f"Error generating individual logo: {str(e)}")
                    # Continue to next iteration instead of returning error immediately
            
            if not logos:
                raise Exception("Failed to generate any logos")
            
            return JsonResponse({'logos': logos})
        except Exception as e:
            logger.error(f"Error in generate_logos: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def convert_to_video(request):
    if request.method == 'POST':
        image_url = request.POST.get('imageUrl')
        
        if not image_url:
            return JsonResponse({'error': 'Image URL is required'}, status=400)
        
        print(f"Received image URL: {image_url}")
        
        try:
            url = 'https://api.aivideoapi.com/runway/generate/image'
            headers = {
                "accept": "application/json",
                "content-type": "application/json",
                "Authorization": AIVIDEOAPI_KEY
            }
            data = {
                'img_prompt': image_url,
                'model': 'gen3',
                'image_as_end_frame': False,
                'flip': False,
                'motion': 5,
                'seed': 0,
                'time': 5
            }
            
            print(f"Sending request to {url} with data: {data}")
            api_response = requests.post(url, headers=headers, json=data)
            
            print(f"Response status code: {api_response.status_code}")
            print(f"Response content: {api_response.text}")
            
            response_data = api_response.json()
            print(f"Parsed JSON response: {response_data}")
            
            if response_data.get('status') == 'Task is in queue':
                return JsonResponse({'jobId': response_data.get('uuid'), 'status': 'processing'})
            elif 'id' in response_data:
                return JsonResponse({'jobId': response_data['id'], 'status': 'processing'})
            elif 'video_url' in response_data:
                return JsonResponse({'videoUrl': response_data['video_url'], 'status': 'completed'})
            elif 'gif_url' in response_data:
                return JsonResponse({'gifUrl': response_data['gif_url'], 'status': 'completed'})
            else:
                return JsonResponse({'error': 'Unexpected response from AI Video API'}, status=500)
        
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def check_video_status(request):
    if request.method == 'GET':
        job_id = request.GET.get('jobId')
        
        if not job_id:
            return JsonResponse({'error': 'Job ID is required'}, status=400)
        
        try:
            url = 'https://api.aivideoapi.com/status'
            headers = {
                "accept": "application/json",
                "Authorization": AIVIDEOAPI_KEY
            }
            params = {
                "uuid": job_id
            }
            
            print(f"Checking status for job ID: {job_id}")
            api_response = requests.get(url, headers=headers, params=params)
            
            print(f"Status check response status code: {api_response.status_code}")
            print(f"Status check response content: {api_response.text}")
            
            response_data = api_response.json()
            print(f"Parsed JSON response: {response_data}")
            
            status = response_data.get('status')
            if status == 'success':
                video_url = response_data.get('url')  # Changed from 'video_url' to 'url'
                gif_url = response_data.get('gif_url')
                
                # Log video information
                if video_url:
                    video_info = requests.head(video_url)
                    print(f"Video Content-Type: {video_info.headers.get('Content-Type')}")
                    print(f"Video Content-Length: {video_info.headers.get('Content-Length')}")
                
                return JsonResponse({
                    'status': 'completed',
                    'videoUrl': video_url,
                    'gifUrl': gif_url
                })
            elif status in ['in queue', 'submitted']:
                return JsonResponse({'status': 'processing'})
            elif status == 'failed':
                return JsonResponse({
                    'status': 'failed',
                    'error': response_data.get('error'),
                    'errorCode': response_data.get('error_code')
                })
            else:
                return JsonResponse({'status': 'unknown', 'message': 'Unexpected status from API'})
        
        except Exception as e:
            print(f"Unexpected error in check_video_status: {str(e)}")
            return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=400)