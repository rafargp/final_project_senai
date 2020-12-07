package com.senai.ui.home;

import androidx.lifecycle.ViewModel;

import com.senai.data.CommandRepository;
import com.senai.data.DeviceRepository;
import com.senai.data.model.Device;
import com.senai.data.model.Device_Data;

import java.util.List;

import retrofit2.Callback;

public class CommandViewModel extends ViewModel {
    private CommandRepository commandRepository;

    public CommandViewModel(CommandRepository commandRepository){
        this.commandRepository = commandRepository;
    }

    public void toggle_led(Callback<String> callback){
        commandRepository.toggle_led(callback);
    }
    public void water_bomb(Callback<String> callback){
        commandRepository.water_bomb(callback);
    }
    public void is_alive(Callback<String> callback){
        commandRepository.is_alive(callback);
    }
}
