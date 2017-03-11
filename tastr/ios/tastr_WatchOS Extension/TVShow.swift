//
//  TVShow.swift
//  tastr
//
//  Created by Hadrien Barbat on 07/03/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

import UIKit

public class TVShow: NSObject {
  public var title: String
  public var details: String
  
  init(title: String, details: String) {
    self.title = title
    self.details = details
  }
}
