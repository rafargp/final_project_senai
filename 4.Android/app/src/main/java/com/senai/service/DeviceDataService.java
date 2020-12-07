package com.senai.service;

import com.senai.data.model.Device;
import com.senai.data.model.Device_Data;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface DeviceDataService {

    @GET("app/devices/available")
    Call<List<Device>> list_available();

    @GET("app/devices/available")
    Call<List<Device>> list_available(@Query("code") Integer code);

    @GET("app/devices/my")
    Call<List<Device>> list_user_devices(@Query("id") int id);

    @FormUrlEncoded
    @POST("app/device/data")
    Call<List<Device_Data>> list_data(@Field("id") int id);
}
