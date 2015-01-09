class Card < ActiveRecord::Base
  belongs_to :expansion
  has_one :expansion
  self.primary_key = "multiverseid"
end
