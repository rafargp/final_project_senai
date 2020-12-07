package com.senai.data;

import com.senai.data.model.Device;
import com.senai.data.model.Device_Data;
import com.senai.data.network.RetrofitClientInstance;
import com.senai.service.CommandDataService;
import com.senai.service.DeviceDataService;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;

public class CommandDataSource {

    private CommandDataService service;

    public CommandDataSource(){
        service = RetrofitClientInstance.getRetrofitInstance().create(CommandDataService.class);
    }

    public void toggle_led(Callback<String> callback) {
        try {
            Call<String> call = service.toggle_led();
            call.enqueue(callback);
        } catch (Exception e) {

        }
    }
    public void water_bomb(Callback<String> callback) {
        try {
            Call<String> call = service.water_bomb();
            call.enqueue(callback);
        } catch (Exception e) {

        }
    }
    public void is_alive(Callback<String> callback) {
        try {
            Call<String> call = service.is_alive();
            call.enqueue(callback);
        } catch (Exception e) {

        }
    }
}