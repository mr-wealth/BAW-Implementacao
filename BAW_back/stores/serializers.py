from rest_framework import serializers
from .models import Store

class StoreSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.username', read_only=True)
    
    class Meta:
        model = Store
        fields = ['id', 'owner', 'owner_name', 'name', 'description', 'logo', 'banner_image',
                  'country', 'language', 'contact_email', 'contact_phone', 'is_active',
                  'is_verified', 'rating', 'total_products', 'created_at', 'updated_at']
        read_only_fields = ['id', 'owner', 'rating', 'total_products', 'created_at', 'updated_at']

class StoreCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ['name', 'description', 'logo', 'banner_image', 'country', 'language',
                  'contact_email', 'contact_phone']
