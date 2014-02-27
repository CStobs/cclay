package com.ces.service;

import com.ces.domain.User;

public class UserServiceImpl implements UserService {

	@Override
	public void add(User user) {
            //Persist the user object here. 
            System.out.println("User added successfully");
	}
}
