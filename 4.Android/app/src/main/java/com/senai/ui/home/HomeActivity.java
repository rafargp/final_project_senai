package com.senai.ui.home;

import android.content.Intent;
import android.os.Bundle;

import com.google.android.material.tabs.TabLayout;

import androidx.viewpager.widget.ViewPager;
import androidx.appcompat.app.AppCompatActivity;

import com.senai.R;

public class HomeActivity extends AppCompatActivity {
    private int user_id;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        Intent this_intent = getIntent();
        user_id = this_intent.getIntExtra("user_id",-1);
        SectionsPagerAdapter sectionsPagerAdapter = new SectionsPagerAdapter(this, getSupportFragmentManager(),user_id);
        ViewPager viewPager = findViewById(R.id.home_view_pager);
        viewPager.setAdapter(sectionsPagerAdapter);
        TabLayout tabs = findViewById(R.id.home_tabs);
        tabs.setupWithViewPager(viewPager);
    }
}