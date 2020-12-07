package com.senai.service;

import retrofit2.Call;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.POST;

public interface CommandDataService {

    @GET("app/command/led")
    Call<String> toggle_led();

    @GET("app/command/water")
    Call<String> water_bomb();

    @GET("app/command/alive")
    Call<String> is_alive();
}
