from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CartItem, Wishlist
from .serializers import CartItemSerializer, WishlistSerializer

class CartViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['GET'])
    def cart(self, request):
        cart_items = CartItem.objects.filter(user=request.user)
        serializer = CartItemSerializer(cart_items, many=True)
        total = sum(item.quantity * item.product.price for item in cart_items)
        return Response({
            'items': serializer.data,
            'total': total,
            'count': cart_items.count()
        })
    
    @action(detail=False, methods=['POST'])
    def add(self, request):
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        
        try:
            cart_item, created = CartItem.objects.get_or_create(
                user=request.user,
                product_id=product_id,
                defaults={'quantity': quantity}
            )
            if not created:
                cart_item.quantity += quantity
                cart_item.save()
            return Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['PATCH', 'DELETE'], url_path='(?P<item_id>[^/.]+)')
    def update_cart_item(self, request, item_id=None):
        try:
            cart_item = CartItem.objects.get(id=item_id, user=request.user)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'PATCH':
            quantity = request.data.get('quantity')
            if quantity is not None:
                cart_item.quantity = quantity
                cart_item.save()
            return Response(CartItemSerializer(cart_item).data)
        
        elif request.method == 'DELETE':
            cart_item.delete()
            return Response({'detail': 'Item removed from cart'}, status=status.HTTP_204_NO_CONTENT)

class WishlistViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['GET'])
    def wishlist(self, request):
        wishlist_items = Wishlist.objects.filter(user=request.user)
        serializer = WishlistSerializer(wishlist_items, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['POST'])
    def add_to_wishlist(self, request):
        product_id = request.data.get('product_id')
        try:
            wishlist, created = Wishlist.objects.get_or_create(
                user=request.user,
                product_id=product_id
            )
            return Response(WishlistSerializer(wishlist).data, 
                          status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['DELETE'], url_path='(?P<item_id>[^/.]+)')
    def remove_from_wishlist(self, request, item_id=None):
        try:
            wishlist = Wishlist.objects.get(id=item_id, user=request.user)
            wishlist.delete()
            return Response({'detail': 'Item removed from wishlist'}, status=status.HTTP_204_NO_CONTENT)
        except Wishlist.DoesNotExist:
            return Response({'error': 'Wishlist item not found'}, status=status.HTTP_404_NOT_FOUND)
