<?php

namespace App\Http\Controllers;

use App\Models\Voucher;
use App\Http\Requests\StoreVoucherRequest;
use App\Http\Requests\UpdateVoucherRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class VoucherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $vouchers = Voucher::orderByDesc('id')->paginate(15)->withQueryString();

        return Inertia::render('Autenticado/Vouchers/Index', [
            'vouchers' => $vouchers,
        ]);
    }


    public function use(Request $request, Voucher $voucher)
    {
        if ($voucher->deleted_at) {
            return back()->with('error', 'Este voucher já foi utilizado.');
        }

        $voucher->delete();

        return back()->with('success', 'Voucher utilizado com sucesso.');
    }

public function import(Request $request)
{
    $validated = $request->validate([
        'file' => ['required','file','mimes:csv,txt','max:20480'],
    ]);

    $path = $request->file('file')->getRealPath();
    if (!$path || !is_file($path)) {
        throw \Illuminate\Validation\ValidationException::withMessages(['file' => 'Arquivo inválido.']);
    }

    $handle = fopen($path, 'r');
    if (!$handle) {
        throw \Illuminate\Validation\ValidationException::withMessages(['file' => 'Não foi possível abrir o arquivo.']);
    }

    $now = now();
    $buffer = [];
    $rowNum = 0;

    while (($row = fgetcsv($handle)) !== false) {
        $raw = isset($row[0]) ? trim((string)$row[0]) : '';
        if ($rowNum === 0 && \Illuminate\Support\Str::lower($raw) === 'code') { $rowNum++; continue; }
        if ($raw === '') { $rowNum++; continue; }

        $buffer[] = [
            'code'       => $raw,
            'created_at' => $now,
            'updated_at' => $now,
        ];
        $rowNum++;
    }
    fclose($handle);

    \Illuminate\Support\Facades\DB::transaction(function () use ($buffer) {
        // apaga tudo mantendo a transação viva
        \Illuminate\Support\Facades\DB::table('vouchers')->delete();

        if (!empty($buffer)) {
            foreach (array_chunk($buffer, 1000) as $chunk) {
                \Illuminate\Support\Facades\DB::table('vouchers')->insert($chunk);
            }
        }
    });

    // Se ainda quiser resetar o AUTO_INCREMENT, faça FORA da transação:
    // \Illuminate\Support\Facades\DB::statement('ALTER TABLE vouchers AUTO_INCREMENT = 1');

    return back()->with('success', 'Vouchers importados e substituídos com sucesso.');
}



    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVoucherRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Voucher $voucher)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Voucher $voucher)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVoucherRequest $request, Voucher $voucher)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Voucher $voucher)
    {
        //
    }
}
