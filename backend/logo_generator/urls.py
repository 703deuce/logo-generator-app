from django.urls import path
from . import views

urlpatterns = [
    path('generate-logos/', views.generate_logos, name='generate_logos'),
    path('convert-to-video/', views.convert_to_video, name='convert_to_video'),
    path('check-video-status/', views.check_video_status, name='check_video_status'),
]