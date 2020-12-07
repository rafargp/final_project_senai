package com.senai.data;

import android.util.Log;

import com.senai.data.model.LoggedInUser;
import com.senai.data.network.RetrofitClientInstance;
import com.senai.service.UserDataService;

import java.io.IOException;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UserDataSource {

    private UserDataService service;

    public UserDataSource(){
        service = RetrofitClientInstance.getRetrofitInstance().create(UserDataService.class);
    }

    public void login(String username, String password,Callback<LoggedInUser> callback) {
        LoggedInUser loggedInUser = new LoggedInUser(1,"Rafael");
        try {
            Call<LoggedInUser> call = service.login(username,password);
            call.enqueue(callback);
        } catch (Exception e) {

        }
    }

    public void logout() {

    }

    public void register(String username, String password,Callback<LoggedInUser> callback) {
        try{
            Call<LoggedInUser> call = service.register(username,password);
            call.enqueue(callback);
        }catch (Exception e){

        }
    }
    public boolean exists(String username,Callback<Integer> callback) {
        try{
            Call<Integer> call = service.exists(username);
            call.enqueue(callback);
        }catch (Exception e){

        }
        return true;
    }
}