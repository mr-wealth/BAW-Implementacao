from django.contrib import admin
from .models import Store

@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'is_verified', 'rating', 'created_at']
    list_filter = ['is_verified', 'is_active', 'created_at']
    search_fields = ['name', 'owner__username']
    ordering = ['-created_at']
