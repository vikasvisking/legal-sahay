from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken

import random

class SendOTPView(APIView):
    permission_classes = []

    def post(self, request):
        phone = request.data.get('phone_number')
        if not phone:
            return Response({'error': 'Phone number required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # TODO: Integrate WhatsApp API (Twilio/Meta) here
        # For Dev: Mock OTP
        otp = '123456'
        print(f"OTP for {phone}: {otp}")
        
        # mainly for demo/dev, in prod don't send OTP in response
        return Response({
            'message': 'OTP sent successfully',
            'details': 'Check console for OTP (Dev Mode)',
            'otp': otp 
        })


class VerifyOTPView(APIView):
    permission_classes = []

    def post(self, request):
        phone = request.data.get('phone_number')
        otp = request.data.get('otp')
        
        if not phone or not otp:
            return Response({'error': 'Phone and OTP required'}, status=status.HTTP_400_BAD_REQUEST)

        # Mock Verification (Replace with real logic)
        if otp == '123456':
            user, created = User.objects.get_or_create(phone_number=phone)
            if created:
                user.set_unusable_password()
                user.save()
            
            # Generate JWT Token
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Login successful',
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            })
        
        return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
