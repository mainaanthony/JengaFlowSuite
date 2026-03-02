using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Api.Migrations
{
    /// <inheritdoc />
    public partial class AddProductCostPriceAndStockFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "CostPrice",
                schema: "jengaFlow",
                table: "Products",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "MinimumStock",
                schema: "jengaFlow",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "StockQuantity",
                schema: "jengaFlow",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Branches",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 2, 6, 55, 3, 58, DateTimeKind.Utc).AddTicks(4425));

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Branches",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 2, 6, 55, 3, 58, DateTimeKind.Utc).AddTicks(4430));

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Products",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CostPrice", "CreatedAt" },
                values: new object[] { 0m, new DateTime(2026, 3, 2, 6, 55, 3, 58, DateTimeKind.Utc).AddTicks(4347) });

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Products",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CostPrice", "CreatedAt" },
                values: new object[] { 0m, new DateTime(2026, 3, 2, 6, 55, 3, 58, DateTimeKind.Utc).AddTicks(4351) });

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 2, 6, 55, 3, 58, DateTimeKind.Utc).AddTicks(4514));

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 2, 6, 55, 3, 58, DateTimeKind.Utc).AddTicks(4518));

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 2, 6, 55, 3, 58, DateTimeKind.Utc).AddTicks(4521));

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Roles",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 2, 6, 55, 3, 58, DateTimeKind.Utc).AddTicks(4524));

            migrationBuilder.UpdateData(
                schema: "jengaFlow",
                table: "Roles",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 2, 6, 55, 3, 58, DateTimeKind.Utc).AddTicks(4737));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CostPrice",
                schema: "jengaFlow",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MinimumStock",
                schema: "jengaFlow",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "StockQuantity",
                schema: "jengaFlow",
                table: "Products");

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
        }
    }
}
