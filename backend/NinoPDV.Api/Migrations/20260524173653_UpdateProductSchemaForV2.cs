using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NinoPDV.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProductSchemaForV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PrintTarget",
                table: "Products",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVisible",
                table: "ProductPrices",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "AdditionalPrice",
                table: "ProductCompositions",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "ProductCompositions",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "ProductCompositions",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PrintTarget",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "IsVisible",
                table: "ProductPrices");

            migrationBuilder.DropColumn(
                name: "AdditionalPrice",
                table: "ProductCompositions");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "ProductCompositions");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "ProductCompositions");
        }
    }
}
