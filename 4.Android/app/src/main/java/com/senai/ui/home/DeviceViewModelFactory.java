package com.senai.ui.home;

import androidx.annotation.NonNull;
import androidx.lifecycle.ViewModel;
import androidx.lifecycle.ViewModelProvider;

import com.senai.data.DeviceDataSource;
import com.senai.data.DeviceRepository;
import com.senai.data.UserDataSource;
import com.senai.data.UserRepository;
import com.senai.ui.login.LoginViewModel;

/**
 * ViewModel provider factory to instantiate LoginViewModel.
 * Required given LoginViewModel has a non-empty constructor
 */
public class DeviceViewModelFactory implements ViewModelProvider.Factory {

    @NonNull
    @Override
    @SuppressWarnings("unchecked")
    public <T extends ViewModel> T create(@NonNull Class<T> modelClass) {
        if (modelClass.isAssignableFrom(DeviceViewModel.class)) {
            return (T) new DeviceViewModel(DeviceRepository.getInstance(new DeviceDataSource()));
        } else {
            throw new IllegalArgumentException("Unknown ViewModel class");
        }
    }
}