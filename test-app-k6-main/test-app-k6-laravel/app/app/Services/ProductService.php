<?php 

namespace App\Services;

use App\Repositories\ProductRepository;
use Illuminate\Support\Facades\Redis;

class ProductService
{
    protected $productRepo;

    public function __construct(ProductRepository $productRepo)
    {
        $this->productRepo = $productRepo;
    }

    public function getAllProducts()
    {
        return $this->productRepo->getAll();
    }

    public function createProduct(array $data)
    {
        return $this->productRepo->create($data);
    }

    public function searchProducts($query)
    {
        return $this->productRepo->search($query);
    }

    public function getProductsWithCache()
    {
        $cacheKey = 'test-app-k6:laravel:products_all';
        $products = Redis::get($cacheKey);

        if ($products) {
            return json_decode($products);
        }

        $products = $this->productRepo->getAll();
        Redis::set($cacheKey, json_encode($products), 'EX', 60);

        return $products;
    }
}
