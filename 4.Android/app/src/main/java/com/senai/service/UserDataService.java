package com.senai.service;

import com.senai.data.model.LoggedInUser;

import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.Headers;
import retrofit2.http.POST;

public interface UserDataService {

    @FormUrlEncoded
    @POST("app/login")
    Call<LoggedInUser> login(@Field("username") String username, @Field("password") String password);

    @FormUrlEncoded
    @POST("app/register")
    Call<LoggedInUser> register(@Field("username") String username, @Field("password") String password);

    @FormUrlEncoded
    @POST("app/userexists")
    Call<Integer> exists(@Field("username") String username);

}
