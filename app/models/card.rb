class Card < ActiveRecord::Base
  belongs_to :expansion
  self.primary_key = "multiverseid"
end
