import requests
import time
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import os

API_KEY = os.getenv('BFL_API_KEY')

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
        for _ in range(16):  # Changed from 4 to 16
            try:
                request_data = generate_logo(prompt, width, height)
                request_id = request_data["id"]
                logo_url = get_logo_result(request_id)
                logos.append(logo_url)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
        
        return JsonResponse({'logos': logos})
    
    return JsonResponse({'error': 'Invalid request method'}, status=400)