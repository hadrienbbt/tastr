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
      TVShow(title: "HTGAWM",details: "S01E2"),
      TVShow(title: "Please Like Me",details: "SO4E05"),
      TVShow(title: "Friends",details: "S03E14"),
      TVShow(title: "HTGAWM",details: "S01E2"),
      TVShow(title: "Please Like Me",details: "SO4E05"),
      TVShow(title: "Friends",details: "S03E14"),
      TVShow(title: "HTGAWM",details: "S01E2"),
      TVShow(title: "Please Like Me",details: "SO4E05"),
      TVShow(title: "Friends",details: "S03E14"),
    ]
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
