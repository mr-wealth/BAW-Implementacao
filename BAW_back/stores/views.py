from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Store
from .serializers import StoreSerializer, StoreCreateUpdateSerializer

class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return StoreCreateUpdateSerializer
        return StoreSerializer
    
    @action(detail=False, methods=['GET'], permission_classes=[IsAuthenticated])
    def my_store(self, request):
        try:
            store = request.user.store
            serializer = self.get_serializer(store)
            return Response(serializer.data)
        except Store.DoesNotExist:
            return Response({'error': 'Store not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['POST'], permission_classes=[IsAuthenticated])
    def create_store(self, request):
        if hasattr(request.user, 'store'):
            return Response({'error': 'User already has a store'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = StoreCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            store = serializer.save(owner=request.user)
            return Response(StoreSerializer(store).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
