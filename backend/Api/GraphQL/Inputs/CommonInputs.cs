using Api.Enums;

namespace Api.GraphQL.Inputs
{
    public record CreateProductInput(
        string Name,
        string SKU,
        string? Brand,
        int? CategoryId,
        decimal Price,
        string? Description,
        bool IsActive = true
    );

    public record UpdateProductInput(
        int Id,
        string Name,
        string SKU,
        string? Brand,
        int? CategoryId,
        decimal Price,
        string? Description,
        bool IsActive
    );

    public record CreateCategoryInput(
        string Name,
        string? Description,
        bool IsActive = true
    );

    public record UpdateCategoryInput(
        int Id,
        string Name,
        string? Description,
        bool IsActive
    );

    public record CreateCustomerInput(
        string Name,
        string? Phone,
        string? Email,
        string? Address,
        CustomerType CustomerType = CustomerType.Individual,
        bool IsActive = true
    );

    public record UpdateCustomerInput(
        int Id,
        string Name,
        string? Phone,
        string? Email,
        string? Address,
        CustomerType CustomerType,
        bool IsActive
    );

    public record CreateSupplierInput(
        string Name,
        string? ContactPerson,
        string Phone,
        string Email,
        string? Address,
        bool IsActive = true
    );

    public record UpdateSupplierInput(
        int Id,
        string Name,
        string? ContactPerson,
        string Phone,
        string Email,
        string? Address,
        bool IsActive
    );

    public record CreateBranchInput(
        string Name,
        string Code,
        string? Address,
        string? City,
        string? Phone,
        string? Email,
        bool IsActive = true
    );

    public record UpdateBranchInput(
        int Id,
        string Name,
        string Code,
        string? Address,
        string? City,
        string? Phone,
        string? Email,
        bool IsActive
    );

    public record CreateDriverInput(
        string Name,
        string Phone,
        string? LicenseNumber,
        string Vehicle,
        string? VehicleRegistration,
        string Status = "Available",
        decimal Rating = 0,
        bool IsActive = true
    );

    public record UpdateDriverInput(
        int Id,
        string Name,
        string Phone,
        string? LicenseNumber,
        string Vehicle,
        string? VehicleRegistration,
        string Status,
        decimal Rating,
        bool IsActive
    );

    public record CreateInventoryInput(
        int ProductId,
        int BranchId,
        int Quantity,
        int ReorderLevel = 10,
        int MaxStockLevel = 100
    );

    public record UpdateInventoryInput(
        int Id,
        int ProductId,
        int BranchId,
        int Quantity,
        int ReorderLevel,
        int MaxStockLevel
    );

    public record CreateUserInput(
        string KeycloakId,
        string Username,
        string Email,
        string FirstName,
        string LastName,
        string? Phone,
        int RoleId,
        int BranchId,
        bool IsActive = true
    );

    public record UpdateUserInput(
        int Id,
        string KeycloakId,
        string Username,
        string Email,
        string FirstName,
        string LastName,
        string? Phone,
        int RoleId,
        int BranchId,
        bool IsActive
    );

    public record CreateRoleInput(
        string Name,
        string? Description
    );

    public record UpdateRoleInput(
        int Id,
        string Name,
        string? Description
    );

    public record CreateStockTransferInput(
        string TransferNumber,
        int FromBranchId,
        int ToBranchId,
        int RequestedByUserId,
        int? ApprovedByUserId,
        DateTime RequestedDate,
        StockTransferStatus Status = StockTransferStatus.Pending,
        string? Notes = null
    );

    public record UpdateStockTransferInput(
        int Id,
        string TransferNumber,
        int FromBranchId,
        int ToBranchId,
        int RequestedByUserId,
        int? ApprovedByUserId,
        DateTime RequestedDate,
        StockTransferStatus Status,
        string? Notes
    );

    public record CreateDeliveryInput(
        string DeliveryNumber,
        int? SaleId,
        int CustomerId,
        int DriverId,
        string DeliveryAddress,
        DateTime ScheduledDate,
        DeliveryStatus Status = DeliveryStatus.Scheduled,
        Priority Priority = Priority.Normal,
        string? Notes = null
    );

    public record UpdateDeliveryInput(
        int Id,
        string DeliveryNumber,
        int? SaleId,
        int CustomerId,
        int DriverId,
        string DeliveryAddress,
        DateTime ScheduledDate,
        DeliveryStatus Status,
        Priority Priority,
        string? Notes
    );

    public record CreateGoodsReceivedNoteInput(
        string GRNNumber,
        int PurchaseOrderId,
        int ReceivedByUserId,
        DateTime ReceivedDate,
        GoodsReceivedNoteStatus Status = GoodsReceivedNoteStatus.FullyReceived,
        string? Notes = null
    );

    public record UpdateGoodsReceivedNoteInput(
        int Id,
        string GRNNumber,
        int PurchaseOrderId,
        int ReceivedByUserId,
        DateTime ReceivedDate,
        GoodsReceivedNoteStatus Status,
        string? Notes
    );

    public record CreateTaxReturnInput(
        string Period,
        TaxType TaxType,
        decimal Amount,
        DateTime DueDate,
        TaxReturnStatus Status = TaxReturnStatus.Draft,
        int? SubmittedByUserId = null,
        string? ReferenceNumber = null
    );

    public record UpdateTaxReturnInput(
        int Id,
        string Period,
        TaxType TaxType,
        decimal Amount,
        DateTime DueDate,
        TaxReturnStatus Status,
        int? SubmittedByUserId,
        string? ReferenceNumber
    );
}
