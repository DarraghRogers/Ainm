using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ainm.API.Migrations
{
    /// <inheritdoc />
    public partial class EmailRemovedFromPartnerInvite : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "PartnerInvite");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "PartnerInvite",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
