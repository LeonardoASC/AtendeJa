<?php

namespace App\Policies;

use App\Models\User;
use App\Models\VisitaTecnica;
use Illuminate\Auth\Access\Response;

class VisitaTecnicaPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, VisitaTecnica $visitaTecnica): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, VisitaTecnica $visitaTecnica): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, VisitaTecnica $visitaTecnica): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, VisitaTecnica $visitaTecnica): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, VisitaTecnica $visitaTecnica): bool
    {
        return false;
    }
}
