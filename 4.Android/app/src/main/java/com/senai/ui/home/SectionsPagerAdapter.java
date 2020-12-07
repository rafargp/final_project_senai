package com.senai.ui.home;

import android.content.Context;
import android.os.Bundle;

import androidx.annotation.Nullable;
import androidx.annotation.StringRes;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;

import com.senai.R;

public class SectionsPagerAdapter extends FragmentPagerAdapter {

    @StringRes
    private static final int[] TAB_TITLES = new int[]{R.string.tab_text_1, R.string.tab_text_2,R.string.tab_text_3,R.string.tab_text_4};
    private static int user_id;
    private static final Fragment[] TAB_FRAGMENTS = new Fragment[]{DevicesFragment.newInstance(),DashboardFragment.newInstance(),CommandsFragment.newInstance(),SettingsFragment.newInstance()};
    private final Context mContext;

    public SectionsPagerAdapter(Context context, FragmentManager fm, int user_id) {
        super(fm);
        this.user_id = user_id;
        mContext = context;
    }

    @Override
    public Fragment getItem(int position) {
        Fragment current_fragment = TAB_FRAGMENTS[position];
        Bundle bundle = new Bundle();
        bundle.putInt("user_id",user_id);
        current_fragment.setArguments(bundle);
        return current_fragment;
    }

    @Nullable
    @Override
    public CharSequence getPageTitle(int position) {
        return mContext.getResources().getString(TAB_TITLES[position]);
    }

    @Override
    public int getCount() {
        return TAB_FRAGMENTS.length;
    }
}