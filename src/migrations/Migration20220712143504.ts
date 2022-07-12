import { Migration } from '@mikro-orm/migrations';

export class Migration20220712143504 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "post" ("id" serial primary key, "created_at" timestamptz(0) not null default \'NOW()\', "updated_at" timestamptz(0) not null default \'NOW()\', "title" text not null);');

    this.addSql('alter table "user" alter column "email" type text using ("email"::text);');
    this.addSql('alter table "user" alter column "email" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "post" cascade;');

    this.addSql('alter table "user" alter column "email" type text using ("email"::text);');
    this.addSql('alter table "user" alter column "email" set not null;');
  }

}
