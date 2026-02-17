from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from .models import User

class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.send_otp_url = reverse('send-otp')
        self.verify_otp_url = reverse('verify-otp')
        self.valid_phone = '+919876543210'
        self.valid_otp = '123456'

    def test_send_otp_success(self):
        """Test sending OTP with valid phone number"""
        data = {'phone_number': self.valid_phone}
        response = self.client.post(self.send_otp_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('otp', response.data)  # Since we return OTP in dev mode

    def test_send_otp_missing_phone(self):
        """Test sending OTP without phone number"""
        data = {}
        response = self.client.post(self.send_otp_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_verify_otp_success_new_user(self):
        """Test verifying OTP for a new user (Registration)"""
        # First verify user doesn't exist
        self.assertFalse(User.objects.filter(phone_number=self.valid_phone).exists())
        
        data = {
            'phone_number': self.valid_phone,
            'otp': self.valid_otp
        }
        response = self.client.post(self.verify_otp_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertTrue(User.objects.filter(phone_number=self.valid_phone).exists())

    def test_verify_otp_success_existing_user(self):
        """Test verifying OTP for an existing user (Login)"""
        User.objects.create_user(phone_number=self.valid_phone)
        
        data = {
            'phone_number': self.valid_phone,
            'otp': self.valid_otp
        }
        response = self.client.post(self.verify_otp_url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)

    def test_verify_otp_invalid_otp(self):
        """Test verifying with incorrect OTP"""
        data = {
            'phone_number': self.valid_phone,
            'otp': '000000'
        }
        response = self.client.post(self.verify_otp_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_verify_otp_missing_fields(self):
        """Test verifying with missing data"""
        data = {'phone_number': self.valid_phone}
        response = self.client.post(self.verify_otp_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
