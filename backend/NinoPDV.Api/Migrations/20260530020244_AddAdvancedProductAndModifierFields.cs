using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NinoPDV.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAdvancedProductAndModifierFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ControlStock",
                table: "Products",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsAutoWeight",
                table: "Products",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDivisible",
                table: "Products",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsPerishable",
                table: "Products",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "MaxStock",
                table: "Products",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "MinStock",
                table: "Products",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "PreparationTime",
                table: "Products",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "StockContent",
                table: "Products",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<Guid>(
                name: "StockSectorId",
                table: "Products",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Abbreviation",
                table: "ModifierOptions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "BasePrice",
                table: "ModifierOptions",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "IsVisible",
                table: "ModifierOptions",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "MinQuantity",
                table: "ModifierOptions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalPrice",
                table: "ModifierOptions",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "ProductPromotions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    DayStart = table.Column<string>(type: "text", nullable: false),
                    HourStart = table.Column<int>(type: "integer", nullable: false),
                    DayEnd = table.Column<string>(type: "text", nullable: false),
                    HourEnd = table.Column<int>(type: "integer", nullable: false),
                    Price = table.Column<decimal>(type: "numeric", nullable: false),
                    IsSaleForbidden = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsSynced = table.Column<bool>(type: "boolean", nullable: false),
                    Version = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductPromotions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductPromotions_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StockSectors",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsSynced = table.Column<bool>(type: "boolean", nullable: false),
                    Version = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockSectors", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Products_StockSectorId",
                table: "Products",
                column: "StockSectorId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductPromotions_ProductId",
                table: "ProductPromotions",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_StockSectors_StockSectorId",
                table: "Products",
                column: "StockSectorId",
                principalTable: "StockSectors",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_StockSectors_StockSectorId",
                table: "Products");

            migrationBuilder.DropTable(
                name: "ProductPromotions");

            migrationBuilder.DropTable(
                name: "StockSectors");

            migrationBuilder.DropIndex(
                name: "IX_Products_StockSectorId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ControlStock",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "IsAutoWeight",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "IsDivisible",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "IsPerishable",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MaxStock",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MinStock",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "PreparationTime",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "StockContent",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "StockSectorId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Abbreviation",
                table: "ModifierOptions");

            migrationBuilder.DropColumn(
                name: "BasePrice",
                table: "ModifierOptions");

            migrationBuilder.DropColumn(
                name: "IsVisible",
                table: "ModifierOptions");

            migrationBuilder.DropColumn(
                name: "MinQuantity",
                table: "ModifierOptions");

            migrationBuilder.DropColumn(
                name: "TotalPrice",
                table: "ModifierOptions");
        }
    }
}
