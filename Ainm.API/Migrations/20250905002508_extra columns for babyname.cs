using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ainm.API.Migrations
{
    /// <inheritdoc />
    public partial class extracolumnsforbabyname : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AnglicizedNamesSerialized",
                table: "BabyNames",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "BabyNames",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Pronunciation",
                table: "BabyNames",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "VariantsSerialized",
                table: "BabyNames",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "BabyNames",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "AnglicizedNamesSerialized", "Notes", "Pronunciation", "VariantsSerialized" },
                values: new object[] { "", "", "", "" });

            migrationBuilder.UpdateData(
                table: "BabyNames",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "AnglicizedNamesSerialized", "Notes", "Pronunciation", "VariantsSerialized" },
                values: new object[] { "", "", "", "" });

            migrationBuilder.UpdateData(
                table: "BabyNames",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "AnglicizedNamesSerialized", "Notes", "Pronunciation", "VariantsSerialized" },
                values: new object[] { "", "", "", "" });

            migrationBuilder.UpdateData(
                table: "BabyNames",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "AnglicizedNamesSerialized", "Notes", "Pronunciation", "VariantsSerialized" },
                values: new object[] { "", "", "", "" });

            migrationBuilder.UpdateData(
                table: "BabyNames",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "AnglicizedNamesSerialized", "Notes", "Pronunciation", "VariantsSerialized" },
                values: new object[] { "", "", "", "" });

            migrationBuilder.UpdateData(
                table: "BabyNames",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "AnglicizedNamesSerialized", "Notes", "Pronunciation", "VariantsSerialized" },
                values: new object[] { "", "", "", "" });

            migrationBuilder.UpdateData(
                table: "BabyNames",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "AnglicizedNamesSerialized", "Notes", "Pronunciation", "VariantsSerialized" },
                values: new object[] { "", "", "", "" });

            migrationBuilder.UpdateData(
                table: "BabyNames",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "AnglicizedNamesSerialized", "Notes", "Pronunciation", "VariantsSerialized" },
                values: new object[] { "", "", "", "" });

            migrationBuilder.UpdateData(
                table: "BabyNames",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "AnglicizedNamesSerialized", "Notes", "Pronunciation", "VariantsSerialized" },
                values: new object[] { "", "", "", "" });

            migrationBuilder.UpdateData(
                table: "BabyNames",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "AnglicizedNamesSerialized", "Notes", "Pronunciation", "VariantsSerialized" },
                values: new object[] { "", "", "", "" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AnglicizedNamesSerialized",
                table: "BabyNames");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "BabyNames");

            migrationBuilder.DropColumn(
                name: "Pronunciation",
                table: "BabyNames");

            migrationBuilder.DropColumn(
                name: "VariantsSerialized",
                table: "BabyNames");
        }
    }
}
