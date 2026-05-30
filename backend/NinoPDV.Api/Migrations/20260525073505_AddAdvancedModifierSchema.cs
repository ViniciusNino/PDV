using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NinoPDV.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAdvancedModifierSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPreSelected",
                table: "ModifierOptions",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "ParentOptionId",
                table: "ModifierOptions",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CanBeFractioned",
                table: "ModifierGroups",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsPropType",
                table: "ModifierGroups",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_ModifierOptions_ParentOptionId",
                table: "ModifierOptions",
                column: "ParentOptionId");

            migrationBuilder.AddForeignKey(
                name: "FK_ModifierOptions_ModifierOptions_ParentOptionId",
                table: "ModifierOptions",
                column: "ParentOptionId",
                principalTable: "ModifierOptions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ModifierOptions_ModifierOptions_ParentOptionId",
                table: "ModifierOptions");

            migrationBuilder.DropIndex(
                name: "IX_ModifierOptions_ParentOptionId",
                table: "ModifierOptions");

            migrationBuilder.DropColumn(
                name: "IsPreSelected",
                table: "ModifierOptions");

            migrationBuilder.DropColumn(
                name: "ParentOptionId",
                table: "ModifierOptions");

            migrationBuilder.DropColumn(
                name: "CanBeFractioned",
                table: "ModifierGroups");

            migrationBuilder.DropColumn(
                name: "IsPropType",
                table: "ModifierGroups");
        }
    }
}
