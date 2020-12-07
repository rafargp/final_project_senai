package com.senai.ui.home;

import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProviders;

import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;

import com.senai.R;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class CommandsFragment extends Fragment {

    private Button button_water;
    private Button button_led;
    private Button button_online;
    private EditText text_log;
    private View view;
    private PageViewModel pageViewModel;
    private CommandViewModel commandViewModel;

    public CommandsFragment() {
    }

    public static CommandsFragment newInstance() {
        CommandsFragment fragment = new CommandsFragment();
        Bundle args = new Bundle();
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {}
        pageViewModel = ViewModelProviders.of(this).get(PageViewModel.class);
        commandViewModel = ViewModelProviders.of(this, new CommandViewModelFactory()).get(CommandViewModel.class);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,Bundle savedInstanceState) {
        view = inflater.inflate(R.layout.fragment_commands, container, false);
        //button_water = view.findViewById(R.id.command_button_water);
        //button_led = view.findViewById(R.id.command_button_led);
        //button_online = view.findViewById(R.id.command_button_alive);
        //text_log = view.findViewById(R.id.command_text_log);

        button_led.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                commandViewModel.toggle_led(led_callback());
            }
        });

        button_water.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                commandViewModel.water_bomb(bomb_callback());
            }
        });

        button_online.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                commandViewModel.is_alive(alive_callback());
            }
        });
        return view;
    }
    private Callback<String> led_callback(){
        return new Callback<String>() {
            @Override
            public void onResponse(Call<String> call, Response<String> response) {
                text_log.setText("LED -> " + response.body());
            }

            @Override
            public void onFailure(Call<String> call, Throwable t) {

            }
        };
    }
    private Callback<String> bomb_callback(){
        return new Callback<String>() {
            @Override
            public void onResponse(Call<String> call, Response<String> response) {
                text_log.setText("BOMB_WATER -> " + response.body());
            }

            @Override
            public void onFailure(Call<String> call, Throwable t) {

            }
        };
    }
    private Callback<String> alive_callback(){
        return new Callback<String>() {
            @Override
            public void onResponse(Call<String> call, Response<String> response) {
                text_log.setText("ALIVE -> " + response.body());
            }

            @Override
            public void onFailure(Call<String> call, Throwable t) {

            }
        };
    }
}