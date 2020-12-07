package com.senai.ui.device_search;

import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.ViewModelProviders;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;

import com.senai.R;
import com.senai.data.model.Device;
import com.senai.ui.home.DeviceAdapter;
import com.senai.ui.home.DeviceViewModel;
import com.senai.ui.home.DeviceViewModelFactory;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class DeviceSearchActivity extends AppCompatActivity {

    private DeviceViewModel deviceViewModel;
    private DeviceAdapter deviceAdapter;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_device_search);
        deviceViewModel = ViewModelProviders.of(this, new DeviceViewModelFactory()).get(DeviceViewModel.class);

        final Button submit = findViewById(R.id.register_device_search);
        final RecyclerView rv = findViewById(R.id.register_device_rv);
        final ProgressBar progressBar = findViewById(R.id.device_search_loading);
        progressBar.setVisibility(View.INVISIBLE);
        deviceAdapter = new DeviceAdapter(new ArrayList<Device>());
        rv.setAdapter(deviceAdapter);

        submit.setOnClickListener(new View.OnClickListener() {
            final EditText code = findViewById(R.id.register_device_code);
            @Override
            public void onClick(View view) {
                progressBar.setVisibility(View.VISIBLE);
                deviceViewModel.list_available(available_callback(), Integer.parseInt(code.getText().toString()));
            }
        });
    }
    private Callback<List<Device>> available_callback(){
        final RecyclerView rv = findViewById(R.id.register_device_rv);
        final ProgressBar progressBar = findViewById(R.id.device_search_loading);

        return new Callback<List<Device>>() {
            @Override
            public void onResponse(Call<List<Device>> call, Response<List<Device>> response) {
                deviceAdapter.getDevices().addAll(response.body());
                deviceAdapter.notifyItemInserted(0);
                rv.scrollToPosition(0);
                progressBar.setVisibility(View.INVISIBLE);
            }

            @Override
            public void onFailure(Call<List<Device>> call, Throwable t) {

            }
        };
    }
}