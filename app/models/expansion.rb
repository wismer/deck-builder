class Expansion < ActiveRecord::Base
  has_many :cards

  # def booster
  #   super.split(", ") if super
  # end
end
