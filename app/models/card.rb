class Card < ActiveRecord::Base
  belongs_to :expansion
  has_one :expansion
  self.primary_key = "multiverseid"

  def card_types
    super.split(", ") if super
  end

  def card_subtype
    super.split(", ") if super
  end

  def supertypes
    super.split(", ") if super
  end

  def creature?
    self.types === "Creature"
  end
end
