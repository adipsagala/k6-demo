<?php 

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class ProductRepository
{
    public function getAll()
    {
        return DB::table('products')->select('id', 'name')->limit(10)->get();
    }

    public function create(array $data)
    {
        return DB::table('products')->insertGetId($data);
    }
    
    public function search($query)
    {
        return DB::table('products')
            ->where('name', 'like', "%{$query}%")
            ->select('id', 'name')
            ->limit(10)
            ->get();
    }
}
