//
//  TVShowDataSource.swift
//  tastr
//
//  Created by Hadrien Barbat on 07/03/2017.
//  Copyright © 2017. All rights reserved.
//

import Foundation

public class TVShowDataSource {
  var allObjects: Array<TVShow>
  
  public init() {
    self.allObjects = [
      TVShow(title: "Please",details: "wait"),
		]
  }
	
	public init(watchList: [String : AnyObject]) {
		self.allObjects = []
		for ItemShow in watchList["watchList"] as! [Dictionary<String, Any>] {
			
			if(ItemShow["id_tvdb"] != nil && ItemShow["title"] != nil && ItemShow["details"] != nil) {
				 var _id = ItemShow["id_tvdb"] as! Int
				 var title = ItemShow["title"] as! String
				 var details = ItemShow["details"] as! String
				 self.allObjects.append(TVShow(_id: _id, title: title, details: details))
			} else {
				print("ERROR : nil values")
			}
		}
	}
	
  public var count: Int {
    get {
      return self.allObjects.count
    }
  }
  
  public subscript(index: Int) -> TVShow {
    return self.allObjects[index]
  }

}
