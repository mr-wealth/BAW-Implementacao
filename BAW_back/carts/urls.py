from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

urlpatterns = [
    path('cart/', views.CartViewSet.as_view({'get': 'cart', 'post': 'add'}), name='cart'),
    path('cart/<int:item_id>/', views.CartViewSet.as_view({
        'patch': 'update_cart_item',
        'delete': 'update_cart_item'
    }), name='cart-item'),
    path('wishlist/', views.WishlistViewSet.as_view({'get': 'wishlist', 'post': 'add_to_wishlist'}), name='wishlist'),
    path('wishlist/<int:item_id>/', views.WishlistViewSet.as_view({
        'delete': 'remove_from_wishlist'
    }), name='wishlist-item'),
]
