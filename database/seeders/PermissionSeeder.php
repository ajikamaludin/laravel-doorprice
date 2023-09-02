<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permissions = [
            ['id' => Str::ulid(), 'label' => 'View Dashboard', 'name' => 'view-dashboard'],

            ['id' => Str::ulid(), 'label' => 'Create User', 'name' => 'create-user'],
            ['id' => Str::ulid(), 'label' => 'Update User', 'name' => 'update-user'],
            ['id' => Str::ulid(), 'label' => 'View User', 'name' => 'view-user'],
            ['id' => Str::ulid(), 'label' => 'Delete User', 'name' => 'delete-user'],

            ['id' => Str::ulid(), 'label' => 'Create Role', 'name' => 'create-role'],
            ['id' => Str::ulid(), 'label' => 'Update Role', 'name' => 'update-role'],
            ['id' => Str::ulid(), 'label' => 'View Role', 'name' => 'view-role'],
            ['id' => Str::ulid(), 'label' => 'Delete Role', 'name' => 'delete-role'],

            ['id' => Str::ulid(), 'label' => 'View Setting', 'name' => 'view-setting'],

            ['id' => Str::ulid(), 'label' => 'Create Event', 'name' => 'create-event'],
            ['id' => Str::ulid(), 'label' => 'Update Event', 'name' => 'update-event'],
            ['id' => Str::ulid(), 'label' => 'View Event', 'name' => 'view-event'],
            ['id' => Str::ulid(), 'label' => 'Delete Event', 'name' => 'delete-event'],

            ['id' => Str::ulid(), 'label' => 'Create Peserta', 'name' => 'create-participant'],
            ['id' => Str::ulid(), 'label' => 'Update Peserta', 'name' => 'update-participant'],
            ['id' => Str::ulid(), 'label' => 'View Peserta', 'name' => 'view-participant'],
            ['id' => Str::ulid(), 'label' => 'Delete Peserta', 'name' => 'delete-participant'],

            ['id' => Str::ulid(), 'label' => 'Create Hadiah', 'name' => 'create-gift'],
            ['id' => Str::ulid(), 'label' => 'Update Hadiah', 'name' => 'update-gift'],
            ['id' => Str::ulid(), 'label' => 'View Hadiah', 'name' => 'view-gift'],
            ['id' => Str::ulid(), 'label' => 'Delete Hadiah', 'name' => 'delete-gift'],

            ['id' => Str::ulid(), 'label' => 'Create Drawing', 'name' => 'create-draw'],
            ['id' => Str::ulid(), 'label' => 'Update Drawing', 'name' => 'update-draw'],
            ['id' => Str::ulid(), 'label' => 'View Drawing', 'name' => 'view-draw'],
            ['id' => Str::ulid(), 'label' => 'Delete Drawing', 'name' => 'delete-draw'],
        ];

        foreach ($permissions as $permission) {
            Permission::insert($permission);
        }

        $role = Role::create(['name' => 'admin']);

        $permissions = Permission::all();
        foreach ($permissions as $permission) {
            $role->rolePermissions()->create(['permission_id' => $permission->id]);
        }

        User::create([
            'name' => 'Super Administrator',
            'email' => 'root@admin.com',
            'password' => bcrypt('password'),
        ]);

        $admin = User::create([
            'name' => 'Administator',
            'email' => 'admin@admin.com',
            'password' => bcrypt('password'),
            'role_id' => $role->id,
        ]);

        $setting = [];

        Setting::insert($setting);
    }
}
