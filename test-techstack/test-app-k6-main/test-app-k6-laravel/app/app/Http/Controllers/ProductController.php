<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ProductService;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index()
    {
        $products = $this->productService->getAllProducts();
        return response()->json([
            'status' => 'SUCCESS',
            'message' => 'Product list retrieved',
            'data' => $products
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string']);
        $product = $this->productService->createProduct(['name' => $request->name]);

        return response()->json([
            'status' => 'SUCCESS',
            'message' => 'Product created',
            'data' => ['id' => $product, 'name' => $request->name]
        ]);
    }

    public function withCache()
    {
        $products = $this->productService->getProductsWithCache();
        $source = is_array($products) ? 'Redis cache' : 'database';

        return response()->json([
            'status' => 'SUCCESS',
            'message' => "Products retrieved from {$source}",
            'data' => $products
        ]);
    }

    public function search(Request $request)
    {
        $q = $request->query('q');
        if (!$q) {
            return response()->json([
                'status' => 'FAIL',
                'message' => 'Query param "q" is required',
                'data' => []
            ], 400);
        }

        $results = $this->productService->searchProducts($q);
        return response()->json([
            'status' => 'SUCCESS',
            'message' => 'Search results',
            'data' => $results
        ]);
    }
}
