package com.senai.ui.home;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProviders;
import androidx.recyclerview.widget.ItemTouchHelper;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.senai.R;
import com.senai.data.model.Device;
import com.senai.ui.device_search.DeviceSearchActivity;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class DevicesFragment extends Fragment {

    private PageViewModel pageViewModel;
    private DeviceAdapter deviceAdapter;
    private DeviceViewModel deviceViewModel;
    private ProgressBar progressBar;
    private View view;
    private int user_id;


    public static DevicesFragment newInstance() {
        DevicesFragment fragment = new DevicesFragment();
        Bundle bundle = new Bundle();
        fragment.setArguments(bundle);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        pageViewModel = ViewModelProviders.of(this).get(PageViewModel.class);
        deviceViewModel = ViewModelProviders.of(this, new DeviceViewModelFactory()).get(DeviceViewModel.class);

        if (getArguments() != null) {
            user_id = getArguments().getInt("user_id");
        }
    }

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, final ViewGroup container, Bundle savedInstanceState) {
        view = inflater.inflate(R.layout.fragment_devices, container, false);
        progressBar = view.findViewById(R.id.devices_loading);
        final RecyclerView rv = view.findViewById(R.id.devices_recycler_view_home);
        deviceAdapter = new DeviceAdapter(new ArrayList<Device>());
        rv.setAdapter(deviceAdapter);
        progressBar.setVisibility(View.VISIBLE);
        deviceViewModel.list_user_devices(listMineCallback(),user_id);

        FloatingActionButton addButton = view.findViewById(R.id.devices_button_add);
        addButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(getContext(), DeviceSearchActivity.class);
                intent.putExtra("user_id",user_id);
                startActivityForResult(intent,0);
                /*
                int count = deviceAdapter.getDevices().size()+1;
                Device device = Device.DeviceBuilder.builder().setCode(count).setVersion("1.0").setMode(Device_Mode.LEARN).setHardware("ESP32").build();
                deviceAdapter.getDevices().add(0, device);
                deviceAdapter.notifyItemInserted(0);
                rv.scrollToPosition(0);
                 */
            }
        });

        ItemTouchHelper helper = new ItemTouchHelper(
                new ItemTouchHandler(0,ItemTouchHelper.LEFT)
        );
        helper.attachToRecyclerView(rv);

        deviceAdapter.setListener(new DeviceAdapter.DeviceAdapaterListener() {
            @Override
            public void onItemClick(int position) {

            }

            @Override
            public void onItemLongClick(int position) {

            }

        });
        return view;
    }
    public Callback<List<Device>> listMineCallback(){
        final RecyclerView rv = view.findViewById(R.id.devices_recycler_view_home);
        return new Callback<List<Device>>() {
            @Override
            public void onResponse(Call<List<Device>> call, Response<List<Device>> response) {
                progressBar.setVisibility(View.INVISIBLE);
                deviceAdapter.getDevices().addAll(response.body());
                deviceAdapter.notifyItemInserted(0);
                rv.scrollToPosition(0);
            }

            @Override
            public void onFailure(Call<List<Device>> call, Throwable t) {
                progressBar.setVisibility(View.INVISIBLE);
            }
        };
    }
    private class ItemTouchHandler extends ItemTouchHelper.SimpleCallback {

        public ItemTouchHandler(int dragDirs, int swipeDirs) {
            super(dragDirs, swipeDirs);
        }

        @Override
        public boolean onMove(@NonNull RecyclerView recyclerView, @NonNull RecyclerView.ViewHolder viewHolder, @NonNull RecyclerView.ViewHolder target) {
            int from = viewHolder.getAdapterPosition();
            int to = target.getAdapterPosition();

            Collections.swap(deviceAdapter.getDevices(),from,to);
            deviceAdapter.notifyItemMoved(from,to);
            return false;
        }

        @Override
        public void onSwiped(@NonNull RecyclerView.ViewHolder viewHolder, int direction) {
            deviceAdapter.getDevices().remove(viewHolder.getAdapterPosition());
            deviceAdapter.notifyItemRemoved(viewHolder.getAdapterPosition());
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
    }
}