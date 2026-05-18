using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NinoPDV.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCategorySequence : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Sequence",
                table: "Categories",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Sequence",
                table: "Categories");
        }
    }
}
