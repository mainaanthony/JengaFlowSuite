# PowerShell Script to Generate Complete Entity Structure
# Run this from backend/Api directory

$entities = @(
    @{Name="User"; HasKeycloak=$true; Properties=@("KeycloakId:string", "Username:string", "Email:string", "FirstName:string", "LastName:string", "Phone:string?", "BranchId:int", "RoleId:int", "IsActive:bool")},
    @{Name="Role"; Properties=@("Name:string", "Description:string?")},
    @{Name="Driver"; Properties=@("Name:string", "Phone:string", "LicenseNumber:string?", "Vehicle:string", "VehicleRegistration:string?", "Status:string", "Rating:decimal", "IsActive:bool")},
    @{Name="Inventory"; Properties=@("ProductId:int", "BranchId:int", "Quantity:int", "ReorderLevel:int", "MaxStockLevel:int", "LastRestocked:DateTime")},
    @{Name="Sale"; Properties=@("SaleNumber:string", "CustomerId:int", "BranchId:int", "AttendantUserId:int", "TotalAmount:decimal", "PaymentMethod:PaymentMethod", "Status:OrderStatus", "SaleDate:DateTime")},
    @{Name="PurchaseOrder"; Properties=@("PONumber:string", "SupplierId:int", "CreatedByUserId:int", "ApprovedByUserId:int?", "TotalAmount:decimal", "ExpectedDeliveryDate:DateTime", "Status:OrderStatus", "Notes:string?")},
    @{Name="StockTransfer"; Properties=@("TransferNumber:string", "FromBranchId:int", "ToBranchId:int", "RequestedByUserId:int", "ApprovedByUserId:int?", "Status:StockTransferStatus", "RequestedDate:DateTime", "Notes:string?")},
    @{Name="Delivery"; Properties=@("DeliveryNumber:string", "SaleId:int?", "CustomerId:int", "DriverId:int", "DeliveryAddress:string", "ScheduledDate:DateTime", "Status:DeliveryStatus", "Priority:Priority", "Notes:string?")},
    @{Name="GoodsReceivedNote"; Properties=@("GRNNumber:string", "PurchaseOrderId:int", "ReceivedByUserId:int", "ReceivedDate:DateTime", "Status:GoodsReceivedNoteStatus", "Notes:string?")},
    @{Name="TaxReturn"; Properties=@("Period:string", "TaxType:TaxType", "Amount:decimal", "DueDate:DateTime", "Status:TaxReturnStatus", "SubmittedByUserId:int?", "ReferenceNumber:string?")}
)

Write-Host "Generating complete entity structure for all entities..." -ForegroundColor Green
Write-Host ""

foreach ($entity in $entities) {
    $entityName = $entity.Name
    Write-Host "Processing $entityName..." -ForegroundColor Yellow
    
    # Create folders
    $modelFolder = "Models\$entityName"
    $queryFolder = "GraphQL\Queries\$entityName"
    $mutationFolder = "GraphQL\Mutations\$entityName"
    $serviceImplFolder = "Services\Implementations"
    
    New-Item -ItemType Directory -Force -Path $modelFolder | Out-Null
    New-Item -ItemType Directory -Force -Path $queryFolder | Out-Null
    New-Item -ItemType Directory -Force -Path $mutationFolder | Out-Null
    
    Write-Host "  ✓ Created folders for $entityName" -ForegroundColor Green
}

Write-Host ""
Write-Host "Folder structure created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Use the Branch and Product examples as templates"
Write-Host "2. Create Model, MutationInput, Query, Mutation, Service, and ServiceImplementation for each entity"
Write-Host "3. Register each service in Program.cs"
Write-Host "4. Update DbContext to use new model namespaces"
