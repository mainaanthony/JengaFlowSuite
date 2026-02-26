using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryAndSupplierSeeding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Branches",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 26, 20, 37, 7, 133, DateTimeKind.Utc).AddTicks(1007));

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Branches",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 26, 20, 37, 7, 133, DateTimeKind.Utc).AddTicks(1019));

            migrationBuilder.InsertData(
                schema: "jengaFlow",
                table: "Categories",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "Description", "IsActive", "Name", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Cement, steel, timber, and other construction materials", true, "Building Materials", null, null },
                    { 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Nails, screws, bolts, and general hardware supplies", true, "Hardware", null, null },
                    { 3, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Pipes, fittings, taps, and plumbing accessories", true, "Plumbing", null, null },
                    { 4, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Cables, switches, sockets, and electrical components", true, "Electrical", null, null },
                    { 5, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Interior and exterior paints, varnishes, and coatings", true, "Paint & Finishes", null, null },
                    { 6, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "Hand tools, power tools, and construction equipment", true, "Tools & Equipment", null, null }
                });

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 26, 20, 37, 7, 133, DateTimeKind.Utc).AddTicks(818));

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 26, 20, 37, 7, 133, DateTimeKind.Utc).AddTicks(828));

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 26, 20, 37, 7, 133, DateTimeKind.Utc).AddTicks(1197));

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 26, 20, 37, 7, 133, DateTimeKind.Utc).AddTicks(1204));

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 26, 20, 37, 7, 133, DateTimeKind.Utc).AddTicks(1211));

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 26, 20, 37, 7, 133, DateTimeKind.Utc).AddTicks(1217));

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Roles",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 26, 20, 37, 7, 133, DateTimeKind.Utc).AddTicks(1223));

            migrationBuilder.InsertData(
                schema: "jengaFlow",
                table: "Suppliers",
                columns: new[] { "Id", "Address", "Category", "ContactPerson", "CreatedAt", "CreatedBy", "Email", "IsActive", "Name", "Phone", "Rating", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 1, "Industrial Area, Nairobi", "Building Materials", "John Kamau", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "sales@kenyabuilding.co.ke", true, "Kenya Building Supplies Ltd", "+254711000001", 4.5m, null, null },
                    { 2, "Mombasa Road, Nairobi", "Hardware", "Amina Hassan", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "info@eahardware.co.ke", true, "East Africa Hardware Co.", "+254722000002", 4.2m, null, null },
                    { 3, "Athi River, Machakos", "Building Materials", "Peter Ochieng", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "orders@mabati.com", true, "Mabati Rolling Mills", "+254733000003", 4.8m, null, null },
                    { 4, "Likoni Road, Industrial Area, Nairobi", "Paint & Finishes", "Grace Wanjiku", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), null, "supply@crownpaints.co.ke", true, "Crown Paints Kenya", "+254744000004", 4.6m, null, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                schema: "jengaFlow",
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                schema: "jengaFlow",
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                schema: "jengaFlow",
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                schema: "jengaFlow",
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                schema: "jengaFlow",
                table: "Categories",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                schema: "jengaFlow",
                table: "Categories",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                schema: "jengaFlow",
                table: "Suppliers",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                schema: "jengaFlow",
                table: "Suppliers",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                schema: "jengaFlow",
                table: "Suppliers",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                schema: "jengaFlow",
                table: "Suppliers",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Branches",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 24, 8, 45, 49, 253, DateTimeKind.Utc).AddTicks(8065));

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Branches",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 24, 8, 45, 49, 253, DateTimeKind.Utc).AddTicks(8077));

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 24, 8, 45, 49, 253, DateTimeKind.Utc).AddTicks(7588));

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 24, 8, 45, 49, 253, DateTimeKind.Utc).AddTicks(7598));

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 24, 8, 45, 49, 253, DateTimeKind.Utc).AddTicks(8207));

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 24, 8, 45, 49, 253, DateTimeKind.Utc).AddTicks(8213));

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 24, 8, 45, 49, 253, DateTimeKind.Utc).AddTicks(8218));

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 24, 8, 45, 49, 253, DateTimeKind.Utc).AddTicks(8224));

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Roles",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 2, 24, 8, 45, 49, 253, DateTimeKind.Utc).AddTicks(8229));
        }
    }
}
