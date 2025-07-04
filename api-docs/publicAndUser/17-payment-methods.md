# 17. Phương thức thanh toán (Payment Methods)

## Lấy danh sách phương thức thanh toán

### GET /api/payment-methods

**Mô tả**: Lấy danh sách tất cả phương thức thanh toán có sẵn

**Phương thức**: GET

**URL**: `/api/payment-methods`

**Phân quyền**: Không yêu cầu authentication

**Response thành công (200)**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "cod",
      "display_name": "Thanh toán khi nhận hàng (COD)",
      "description": "Thanh toán bằng tiền mặt khi nhận hàng",
      "icon": "https://example.com/icons/cod.png",
      "is_active": true,
      "fees": {
        "fixed_fee": 0,
        "percentage_fee": 0
      },
      "supported_regions": ["nationwide"]
    },
    {
      "id": 2,
      "name": "vnpay",
      "display_name": "VNPay",
      "description": "Thanh toán qua ví điện tử VNPay",
      "icon": "https://example.com/icons/vnpay.png",
      "is_active": true,
      "fees": {
        "fixed_fee": 0,
        "percentage_fee": 1.5
      },
      "supported_regions": ["nationwide"]
    },
    {
      "id": 3,
      "name": "momo",
      "display_name": "MoMo",
      "description": "Thanh toán qua ví điện tử MoMo",
      "icon": "https://example.com/icons/momo.png",
      "is_active": true,
      "fees": {
        "fixed_fee": 0,
        "percentage_fee": 2.0
      },
      "supported_regions": ["nationwide"]
    },
    {
      "id": 4,
      "name": "bank_transfer",
      "display_name": "Chuyển khoản ngân hàng",
      "description": "Chuyển khoản trực tiếp qua ngân hàng",
      "icon": "https://example.com/icons/bank.png",
      "is_active": true,
      "fees": {
        "fixed_fee": 0,
        "percentage_fee": 0
      },
      "supported_regions": ["nationwide"],
      "bank_info": {
        "bank_name": "Ngân hàng TMCP Á Châu (ACB)",
        "account_number": "123456789",
        "account_name": "CONG TY BALOZONE",
        "branch": "Chi nhánh TP.HCM"
      }
    }
  ],
  "message": "Lấy danh sách phương thức thanh toán thành công"
}
```

## Tạo thanh toán VNPay

### POST /api/payment/vnpay/create

**Mô tả**: Tạo URL thanh toán VNPay cho đơn hàng

**Phương thức**: POST

**URL**: `/api/payment/vnpay/create`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:

```json
{
  "order_id": 1,
  "amount": 1130000,
  "order_desc": "Thanh toán đơn hàng ORD-2024-001",
  "return_url": "https://example.com/payment/vnpay/return"
}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "payment_url": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=113000000&vnp_Command=pay&vnp_CreateDate=20240101120000&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+ORD-2024-001&vnp_OrderType=other&vnp_ReturnUrl=https%3A%2F%2Fexample.com%2Fpayment%2Fvnpay%2Freturn&vnp_TmnCode=DEMO&vnp_TxnRef=1&vnp_Version=2.1.0&vnp_SecureHash=abcdef123456789",
    "transaction_id": "VNP-2024-001",
    "expires_at": "2024-01-01T12:15:00.000000Z"
  },
  "message": "Tạo thanh toán VNPay thành công"
}
```

**Validation rules**:

- `order_id` (integer, required): ID đơn hàng
- `amount` (integer, required): Số tiền thanh toán
- `order_desc` (string, required): Mô tả đơn hàng
- `return_url` (string, required): URL trả về sau khi thanh toán

## Xử lý callback VNPay

### POST /api/payment/vnpay/callback

**Mô tả**: Xử lý callback từ VNPay sau khi thanh toán

**Phương thức**: POST

**URL**: `/api/payment/vnpay/callback`

**Phân quyền**: Không yêu cầu authentication (webhook từ VNPay)

**Headers**:

```
Content-Type: application/json
```

**Body**: Dữ liệu callback từ VNPay

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Xử lý callback thành công"
}
```

## Tạo thanh toán MoMo

### POST /api/payment/momo/create

**Mô tả**: Tạo thanh toán MoMo cho đơn hàng

**Phương thức**: POST

**URL**: `/api/payment/momo/create`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:

```json
{
  "order_id": 1,
  "amount": 1130000,
  "order_desc": "Thanh toán đơn hàng ORD-2024-001",
  "return_url": "https://example.com/payment/momo/return"
}
```

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "payment_url": "https://test-payment.momo.vn/gw_payment/transactionProcessor?partnerCode=MOMO&orderId=1&requestId=MOMO-2024-001&amount=1130000&orderInfo=Thanh+toan+don+hang+ORD-2024-001&returnUrl=https%3A%2F%2Fexample.com%2Fpayment%2Fmomo%2Freturn&notifyUrl=https%3A%2F%2Fexample.com%2Fapi%2Fpayment%2Fmomo%2Fcallback&signature=abcdef123456789",
    "transaction_id": "MOMO-2024-001",
    "expires_at": "2024-01-01T12:15:00.000000Z"
  },
  "message": "Tạo thanh toán MoMo thành công"
}
```

## Xử lý callback MoMo

### POST /api/payment/momo/callback

**Mô tả**: Xử lý callback từ MoMo sau khi thanh toán

**Phương thức**: POST

**URL**: `/api/payment/momo/callback`

**Phân quyền**: Không yêu cầu authentication (webhook từ MoMo)

**Headers**:

```
Content-Type: application/json
```

**Body**: Dữ liệu callback từ MoMo

**Response thành công (200)**:

```json
{
  "success": true,
  "message": "Xử lý callback thành công"
}
```

## Kiểm tra trạng thái thanh toán

### GET /api/payment/status/{order_id}

**Mô tả**: Kiểm tra trạng thái thanh toán của đơn hàng

**Phương thức**: GET

**URL**: `/api/payment/status/{order_id}`

**Phân quyền**: Yêu cầu authentication (Bearer Token)

**Headers**:

```
Authorization: Bearer {token}
```

**Tham số URL**:

- `order_id` (integer, required): ID đơn hàng

**Response thành công (200)**:

```json
{
  "success": true,
  "data": {
    "order_id": 1,
    "payment_status": "paid",
    "payment_method": "vnpay",
    "transaction_id": "VNP-2024-001",
    "amount": 1130000,
    "paid_at": "2024-01-01T12:05:00.000000Z",
    "payment_details": {
      "bank_code": "NCB",
      "card_type": "ATM",
      "transaction_fee": 0
    }
  },
  "message": "Lấy trạng thái thanh toán thành công"
}
```

**Lưu ý**:

- Endpoint danh sách phương thức thanh toán là public
- Các endpoint tạo thanh toán yêu cầu authentication
- Callback endpoints không yêu cầu authentication (webhook)
- Phí thanh toán được tính theo % hoặc số tiền cố định
- URL thanh toán có thời gian hết hạn (thường là 15 phút)
- Hệ thống hỗ trợ nhiều phương thức thanh toán: COD, VNPay, MoMo, Bank Transfer
- Trạng thái thanh toán: pending, paid, failed, cancelled
