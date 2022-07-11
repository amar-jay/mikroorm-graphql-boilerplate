import { Migration } from '@mikro-orm/migrations';

export class Migration20220711175315 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null default \'NOW()\', "name" text not null, "password" text not null);');

    this.addSql('create table "foo" ("id" serial primary key, "created_at" timestamptz(0) not null default \'NOW()\', "updated_at" timestamptz(0) not null default \'NOW()\', "title" text not null);');
  }

}
