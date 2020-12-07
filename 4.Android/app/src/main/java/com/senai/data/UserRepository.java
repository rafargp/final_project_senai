package com.senai.data;

import com.senai.data.model.LoggedInUser;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UserRepository {

    private static volatile UserRepository instance;

    private UserDataSource dataSource;

    private LoggedInUser user = null;

    private UserRepository(UserDataSource dataSource) {
        this.dataSource = dataSource;
    }

    public static UserRepository getInstance(UserDataSource dataSource) {
        if (instance == null) instance = new UserRepository(dataSource);
        return instance;
    }

    public boolean isLoggedIn() {
        return user != null;
    }

    public void logout() {
        user = null;
        dataSource.logout();
    }

    public void setLoggedInUser(LoggedInUser user) {
        this.user = user;
    }

    public void login(String username, String password, Callback<LoggedInUser> callback) {
        dataSource.login(username, password,callback);
    }

    public void register(String username, String password,Callback<LoggedInUser> callback) {
        dataSource.register(username,password,callback);
    }

    public boolean exists(String username, Callback<Integer> callback) {
        return dataSource.exists(username,callback);
    }
}