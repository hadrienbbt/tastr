//
//  TVShow.swift
//  tastr
//
//  Created by Hadrien Barbat on 07/03/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

import UIKit

public class TVShow: NSObject {
	public var _id: Int
  public var title: String
  public var details: String
  
	init(_id: Int = 0, title: String, details: String) {
		self._id = _id
    self.title = title
    self.details = details
  }
}
