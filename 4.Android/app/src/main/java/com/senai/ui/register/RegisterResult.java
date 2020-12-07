package com.senai.ui.register;

import androidx.annotation.Nullable;

/**
 * Authentication result : success (user details) or error message.
 */
class RegisterResult {
    @Nullable
    private Integer error;
    @Nullable
    private boolean success;
    RegisterResult(@Nullable Integer error) {
        this.error = error;
    }

    RegisterResult(@Nullable boolean success) {
        this.success = success;
    }

    @Nullable
    boolean getSuccess() {
        return success;
    }

    @Nullable
    Integer getError() {
        return error;
    }
}