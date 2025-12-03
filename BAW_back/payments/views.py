from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import uuid
from .models import Payment
from .serializers import PaymentSerializer, PaymentCreateSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['POST'])
    def initialize(self, request):
        order_id = request.data.get('order_id')
        method = request.data.get('method')
        
        from orders.models import Order
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if method not in dict(Payment.PAYMENT_METHOD_CHOICES):
            return Response({'error': 'Invalid payment method'}, status=status.HTTP_400_BAD_REQUEST)
        
        transaction_id = f"TXN-{uuid.uuid4().hex[:12].upper()}"
        
        payment = Payment.objects.create(
            order=order,
            amount=order.total_amount,
            method=method,
            transaction_id=transaction_id
        )
        
        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['GET'])
    def verify(self, request, pk=None):
        payment = self.get_object()
        # Here you would integrate with actual payment gateway
        # For now, we'll just return the payment status
        return Response(PaymentSerializer(payment).data)
