//
//  TVShowTableRowController
//  tastr
//
//  Created by Hadrien Barbat on 07/03/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

import Foundation
import WatchKit

public class TVShowTableRowController: NSObject {
  
  @IBOutlet var titre: WKInterfaceLabel!
  @IBOutlet var episode: WKInterfaceLabel!
  
  func fillTVShowList(tvshow: TVShow) {
    self.titre.setText(tvshow.title)
    self.episode.setText(tvshow.details)
  }
  
}
