package com.senai.ui.register;

import android.util.Patterns;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.senai.R;
import com.senai.data.UserRepository;
import com.senai.data.model.LoggedInUser;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegisterViewModel extends ViewModel {

    private UserRepository userRepository;
    private MutableLiveData<RegisterFormState> registerFormState = new MutableLiveData<>();
    private MutableLiveData<RegisterResult> registerResult = new MutableLiveData<>();

    public RegisterViewModel(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public void register(String username, String password,Callback<LoggedInUser> callback){
        userRepository.register(username,password,callback);
    }

    LiveData<RegisterFormState> getRegisterFormState() {
        return registerFormState;
    }

    LiveData<RegisterResult> getRegisterResult() {
        return registerResult;
    }

    public void registerDataChanged(String username, String password) {
        if (!isUserNameValid(username)) {
            registerFormState.setValue(new RegisterFormState(R.string.invalid_username, null));
        } else if (!isPasswordValid(password)) {
            registerFormState.setValue(new RegisterFormState(null, R.string.invalid_password));
        } else {
            userRepository.exists(username,existsCallback());
        }
    }
    private boolean isUserNameValid(String username) {
        if (username == null) {
            return false;
        }
        if (username.contains("@")) {
            return Patterns.EMAIL_ADDRESS.matcher(username).matches();
        } else {
            return !username.trim().isEmpty();
        }
    }

    private boolean isPasswordValid(String password) {
        return password != null && password.trim().length() > 5;
    }

    public Callback<Integer> existsCallback(){
        return new Callback<Integer>() {
            @Override
            public void onResponse(Call<Integer> call, Response<Integer> response) {
                if(response.body() == 0){
                    registerFormState.setValue(new RegisterFormState(true));
                }else{
                    registerFormState.setValue(new RegisterFormState(R.string.existent_username, null));
                }
            }

            @Override
            public void onFailure(Call<Integer> call, Throwable t) {
                registerFormState.setValue(new RegisterFormState(R.string.invalid_request, null));
            }
        };
    }

}
